import { auth } from '@/auth';
import { hasValidSubscription } from '@/app/lib/data';

export default async function Badge() {
  const currentUser = await auth().then((session) => session?.user);
  if (currentUser?.email && await hasValidSubscription(currentUser.email)) {
    return (
      <div className="absolute top-0 right-0 z-50 m-2 px-2 py-1 bg-yellow-400 text-yellow-800 text-xs font-bold rounded shadow-md">
        GOLDEN
      </div>
    );
  }
};
