import { useUser } from '@/hooks/use-user';
import { useGetItemsByUserId } from '@/lib/plaid/item';

const Manage = () => {
  const { user } = useUser({ redirectTo: '/login' });
  const { data: items } = useGetItemsByUserId({ enabled: !!user }, user?.id);

  if (!user) return <>Loading . . .</>;

  return (
    <>
      <h1>Manage</h1>
      <ul className="grid w-full grid-cols-1 justify-start gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <li className="col-span-1 rounded-lg bg-slate-800 p-16  shadow">WELLS FARGO</li>
      </ul>
    </>
  );
};

export default Manage;
