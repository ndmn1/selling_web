import React, { Suspense } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import TabContentServer from "./_components/TabContentServer";
import LoadingCircle from "@/components/LoadingCircle";
import ProfileSidebar from "./_components/ProfileSidebar";

export type SearchParams = Promise<{
  [key: string]: string | string[] | undefined;
}>;

export default async function ProfilePage(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;
  const tab = (searchParams.tab as string) || "info";

  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-2xl font-bold mb-6">Tài khoản của tôi</h1>
        <div className="flex flex-col lg:flex-row gap-6">
          <ProfileSidebar activeTab={tab} />
          <div className="w-full flex-1">
            <Suspense key={`content-${tab}`} fallback={<LoadingCircle />}>
              <TabContentServer userId={userId} tab={tab} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
