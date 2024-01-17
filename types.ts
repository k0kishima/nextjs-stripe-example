export type Currency = 'usd';
export type Interval = 'day' | 'month' | 'week' | 'year';

export type Price = {
  id: string;
  unit_amount: number;
  currency: Currency;
  interval: Interval;
};
