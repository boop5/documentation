import {
  jsonEvent,
  ANY,
  NO_STREAM,
  START,
  FORWARD,
  STREAM_NAME,
} from "@eventstore/db-client";

export async function subscribeToStream(client) {
  // region subscribe-to-stream
  const subscription = client
    .subscribeToStream("some-stream")
    .on("data", function (resolvedEvent) {
      console.log(
        `Received event ${resolvedEvent.event.revision}@${resolvedEvent.event.streamId}`
      );
      handleEvent(resolvedEvent);
    });
  // endregion subscribe-to-stream
}

export async function subscribeToStreamFromPosition(client) {
  // region subscribe-to-stream-from-position
  const subscription = client
    .subscribeToStream("some-stream", { fromRevision: BigInt(20) })
    .on("data", handleEvent);
  // endregion subscribe-to-stream-from-position
}

export async function subscribeToStreamLive(client) {
  // region subscribe-to-stream-live
  const subscription = client
    .subscribeToStream("some-stream", { fromRevision: END })
    .on("data", handleEvent);
  // endregion subscribe-to-stream-live
}

export async function subscribeToStreamResolvingLinkTos(client) {
  // region subscribe-to-stream-resolving-linktos
  const subscription = client
    .subscribeToStream("$et-myEventType", {
      fromRevision: START,
      resolveLinks: true,
    })
    .on("data", handleEvent);
  // endregion subscribe-to-stream-resolving-linktos
}

export async function subscribeToStreamSubscriptionDropped(client) {
  // region subscribe-to-stream-resolving-linktos
  let checkpoint = START;
  const subscription = client
    .subscribeToStream("some-stream", {
      fromRevision: checkpoint,
      resolveLinks: true,
    })
    .on("data", function (resolvedEvent) {
      handleEvent(resolvedEvent);
      checkpoint = resolvedEvent.event.revision;
    });
  // endregion subscribe-to-stream-resolving-linktos
}

// 			#region subscribe-to-stream-subscription-dropped
// 			var checkpoint = StreamPosition.Start;
// 			await client.SubscribeToStreamAsync(
// 				"some-stream",
// 				checkpoint,
// 				eventAppeared: async (subscription, evnt, cancellationToken) => {
// 					await HandleEvent(evnt);
// 					checkpoint = evnt.OriginalEventNumber;
// 				},
// 				subscriptionDropped: ((subscription, reason, exception) => {
// 					Console.WriteLine($"Subscription was dropped due to {reason}. {exception}");
// 					if (reason != SubscriptionDroppedReason.Disposed) {
// 						// Resubscribe if the client didn't stop the subscription
// 						Resubscribe(checkpoint);
// 					}
// 				}));
// 			#endregion subscribe-to-stream-subscription-dropped
// 		}

export async function subscribeToAll(client) {
  // region subscribe-to-all
  const subscription = client.subscribeToAll().on("data", handleEvent);
  // endregion subscribe-to-all
}

export async function subscribeToAllFromPosition(client) {
  // region subscribe-to-all-from-position
  const subscription = client
    .subscribeToAll({ fromRevision: BigInt(1056) })
    .on("data", function (resolvedEvent) {
      console.log(
        `Received event ${resolvedEvent.event.revision}@${resolvedEvent.event.streamId}`
      );
      handleEvent(resolvedEvent);
    });
  // endregion subscribe-to-all-from-position
}

export async function subscribeToAllLive(client) {
  // region subscribe-to-all-live
  const subscription = client
    .subscribeToAll({ fromRevision: END })
    .on("data", handleEvent);
  // endregion subscribe-to-all-live
}

// 			#region subscribe-to-all-subscription-dropped

// 			var checkpoint = Position.Start;
// 			await client.SubscribeToAllAsync(
// 				checkpoint,
// 				eventAppeared: async (subscription, evnt, cancellationToken) => {
// 					await HandleEvent(evnt);
// 					checkpoint = evnt.OriginalPosition.Value;
// 				},
// 				subscriptionDropped: ((subscription, reason, exception) => {
// 					Console.WriteLine($"Subscription was dropped due to {reason}. {exception}");
// 					if (reason != SubscriptionDroppedReason.Disposed) {
// 						// Resubscribe if the client didn't stop the subscription
// 						Resubscribe(checkpoint);
// 					}
// 				}));
// 			#endregion subscribe-to-all-subscription-dropped
// 		}

export async function subscribeToAllPrefixFiltered(client) {
  // region stream-prefix-filtered-subscription
  const prefixes = ["test-", "other-"];
  const subscription = client
    .subscribeToStream({
      fromRevision: END,
      filter: { filterOn: STREAM_NAME, prefixes },
    })
    .on("data", handleEvent);
  // endregion stream-prefix-filtered-subscription
}

export async function subscribeToAllRegexFiltered(client) {
  // region stream-regex-filtered-subscription
  const regex = /invoice-\d\d\d/g;
  const subscription = client
    .subscribeToStream({
      filter: { filterOn: STREAM_NAME, regex },
    })
    .on("data", handleEvent);
  // endregion stream-regex-filtered-subscription
}

export async function subscribeToAllOverridingUserCredentials(client) {
  // region overriding-user-credentials
  const credentials = {
    username: "admin",
    password: "changeit",
  };
  const subscription = client
    .subscribeToStream({
      credentials,
    })
    .on("data", handleEvent);
  // endregion overriding-user-credentials
}

function handleEvent(event) {
  console.log(event);
}