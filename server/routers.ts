import { initTRPC } from "@trpc/server";
import { z } from "zod";
import superjson from "superjson";
import { db, appointments } from "./db.js";
import { eq, desc } from "drizzle-orm";

const t = initTRPC.context().create({ transformer: superjson });
const publicProcedure = t.procedure;
const router = t.router;

export const appRouter = router({
  appointments: router({
    create: publicProcedure
      .input(
        z.object({
          name: z.string().min(1, "Name is required"),
          phone: z.string().min(1, "Phone is required"),
          email: z.string().email("Invalid email").optional(),
          service: z.string().min(1, "Service is required"),
          preferredDateTime: z.date().optional(),
          message: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const [appointment] = await db
          .insert(appointments)
          .values({
            name: input.name.trim(),
            phone: input.phone.trim(),
            email: input.email?.trim() || null,
            service: input.service.trim(),
            preferredDateTime: input.preferredDateTime ?? null,
            message: input.message?.trim() || null,
            status: "pending",
          })
          .returning();
        return appointment;
      }),

    list: publicProcedure.query(async () => {
      return await db
        .select()
        .from(appointments)
        .orderBy(desc(appointments.createdAt));
    }),

    getById: publicProcedure.input(z.number()).query(async ({ input }) => {
      const [appointment] = await db
        .select()
        .from(appointments)
        .where(eq(appointments.id, input));
      return appointment ?? null;
    }),

    updateStatus: publicProcedure
      .input(
        z.object({
          id: z.number(),
          status: z.enum(["pending", "confirmed", "cancelled"]),
        })
      )
      .mutation(async ({ input }) => {
        const [appointment] = await db
          .update(appointments)
          .set({ status: input.status, updatedAt: new Date() })
          .where(eq(appointments.id, input.id))
          .returning();
        if (!appointment) throw new Error(`Appointment ${input.id} not found`);
        return appointment;
      }),

    delete: publicProcedure.input(z.number()).mutation(async ({ input }) => {
      await db.delete(appointments).where(eq(appointments.id, input));
      return { success: true };
    }),
  }),
});

export type AppRouter = typeof appRouter;
