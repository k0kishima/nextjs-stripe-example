import { auth } from '@/auth';
import { lusitana } from '@/app/ui/fonts';
import { getValidSubscription, hasCancellationHistory } from '@/app/lib/data';
import { getCreditCard } from '@/app/lib/stripe/credit-card';
import SubscriptionInformation from '@/app/ui/subscription-information';
import CancelSubscriptionButton from '@/app/ui/cancel-subscription-button';

export default async function Page() {
  const currentUser = await auth().then((session) => session?.user);
  if (currentUser?.email == null) {
    return null;
  }
  const subscription = await getValidSubscription(currentUser.email)
  if (subscription == null) {
    return null;
  }
  const creditCard = await getCreditCard(subscription.stripe_subscription_id)

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Subscription Information</h1>
      </div>
      <SubscriptionInformation subscription={subscription} creditCard={creditCard} />
      <CancelSubscriptionButton
        subscriptionId={subscription.stripe_subscription_id}
        disabled={await hasCancellationHistory(subscription.stripe_subscription_id)}
      />
    </div>
  );
}
