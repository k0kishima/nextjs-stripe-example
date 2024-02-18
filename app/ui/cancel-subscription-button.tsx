import { Button } from '@/app/ui/button';
import { cancelSubscription } from '@/app/lib/actions';

export default function CancelSubscriptionButton(
  { subscriptionId, disabled} : { subscriptionId: string, disabled: boolean }
) {
  const cancelSubscriptionWithId = cancelSubscription.bind(
    null,
    subscriptionId,
  );

  return (
    <form action={cancelSubscriptionWithId}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <Button type="submit" aria-disabled={disabled}>Cancel Subscription</Button>
      </div>
    </form>
  );
}
