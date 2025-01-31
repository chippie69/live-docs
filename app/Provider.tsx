"use client";

import { ReactNode } from "react";
import { useUser } from "@clerk/nextjs";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";

import { getClerkUsers, getDocumentUsers } from "@/lib/actions/user.actions";
import Loader from "@/components/Loader";

const Provider = ({ children }: { children: ReactNode}) => {
  const { user: clerkUser } = useUser();

  return (
    <LiveblocksProvider 
      authEndpoint="/api/liveblocks-auth"
      resolveUsers={async ({ userIds }) => {
        const users = await getClerkUsers({ userIds});

        return users;
      }}
      resolveMentionSuggestions={async ({ text, roomId }) => {
        const roomUsers = await getDocumentUsers({
          roomId,
          currentUser: clerkUser?.emailAddresses[0].emailAddress!,
          text,
        })

        return roomUsers;
      }}
    >
      <ClientSideSuspense fallback={<Loader />}>
        {children}
      </ClientSideSuspense>
    </LiveblocksProvider>
  )
}


export default Provider;
