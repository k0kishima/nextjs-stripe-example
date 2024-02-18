type Subscription = {
  start_timestamp: string;
  end_timestamp: string;
}

type CreditCard = {
  last4: string;
  brand: string;
  exp_month: number;
  exp_year: number;
}

type Props = {
  subscription: Subscription;
  creditCard: CreditCard;
}

export default function SubscriptionInformation({ subscription, creditCard }: Props) {
  return (
    <div className="flex w-full flex-col md:col-span-4 mt-6">
      <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
        <div className="bg-white p-6 space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Subscription Period</h3>
            <p className="text-sm md:text-base">Start Date: {new Date(subscription.start_timestamp).toLocaleDateString()}</p>
            <p className="text-sm md:text-base">End Date: {new Date(subscription.end_timestamp).toLocaleDateString()}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Payment Method</h3>
            <p className="text-sm md:text-base">Card Number: **** **** **** {creditCard.last4}</p>
            <p className="text-sm md:text-base">Brand: {creditCard.brand}</p>
            <p className="text-sm md:text-base">Expiry Date: {`${creditCard.exp_month}/${creditCard.exp_year}`}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
