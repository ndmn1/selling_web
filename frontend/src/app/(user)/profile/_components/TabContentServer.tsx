import { getUserProfile } from "@/actions/user";
import { getUserOrders } from "@/actions/order";
import UserInfoForm from "./UserInfoForm";
import OrdersList from "./OrdersList";

export default async function TabContentServer({
  userId,
  tab,
}: {
  userId: string;
  tab: string;
}) {
  if (tab === "orders") {
    const orders = await getUserOrders();
    return <OrdersList orders={orders} />;
  }

  const user = await getUserProfile(userId);
  return <UserInfoForm user={user} />;
}
