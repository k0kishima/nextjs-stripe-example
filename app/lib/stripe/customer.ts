import getStripeInstance from './client';
import { User } from '@auth/core/types';
import { sql } from '@vercel/postgres';

async function getUserIdByEmail(email: string): Promise<string | null> {
  const result = await sql<{ id: string }>`
    SELECT id FROM users WHERE email = ${email}
  `;
  return result.rows.length > 0 ? result.rows[0].id : null;
}

export async function createOrUpdateStripeCustomer(
  user: User,
): Promise<string> {
  if (user.email == null) {
    throw new Error('User email is missing.');
  }
  const userId = await getUserIdByEmail(user.email);
  if (!userId) {
    throw new Error('User not found.');
  }

  const existingCustomer = await sql<{ stripe_customer_id: string }>`
    SELECT stripe_customer_id FROM stripe_customers WHERE user_id = ${userId}
  `;

  if (existingCustomer.rows.length === 0) {
    const stripe = getStripeInstance();
    const newStripeCustomer = await stripe.customers.create({
      email: user.email,
    });

    await sql`
      INSERT INTO stripe_customers (user_id, stripe_customer_id)
      VALUES (${userId}, ${newStripeCustomer.id})
    `;
    return newStripeCustomer.id;
  } else {
    return existingCustomer.rows[0].stripe_customer_id;
  }
}
