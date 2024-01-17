const { db } = require('@vercel/postgres');

async function createStripeCustomersTable(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS stripe_customers (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        user_id UUID NOT NULL,
        stripe_customer_id VARCHAR(255) NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
    `;

    console.log(`Created "stripe_customers" table`);
    return createTable;
  } catch (error) {
    console.error('Error creating stripe_customers table:', error);
    throw error;
  }
}

async function createSubscriptionsTable(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`;

    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES users(id),
        stripe_subscription_id VARCHAR(255) NOT NULL,
        stripe_invoice_id VARCHAR(255) UNIQUE,
        start_timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
        end_timestamp TIMESTAMP WITH TIME ZONE NOT NULL
      );
    `;

    console.log(`Created "subscriptions" table`);
    return createTable;
  } catch (error) {
    console.error('Error creating subscriptions table:', error);
    throw error;
  }
}

async function main() {
  const client = await db.connect();

  await createStripeCustomersTable(client);
  await createSubscriptionsTable(client);

  await client.end();
}

main().catch((err) => {
  console.error('An error occurred while running stripeDbMigration:', err);
});
