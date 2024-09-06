'use client';

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ModeToggle } from '@/components/ModeToggle';
import { Input } from '@/components/ui/input';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useQuery } from '@tanstack/react-query';
import { saveAs } from 'file-saver';
import { useEffect, useState } from 'react';
import useOnclickOutside from 'react-cool-onclickoutside';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { useDebounce } from 'use-debounce';
import { AlbumArtwork, LoadingAlbumArtwork } from './components/album-artwork';
import { Menu } from './components/menu';
import { PodcastEmptyPlaceholder } from './components/podcast-empty-placeholder';
import { Sidebar } from './components/sidebar';
import SuggestionCard from './components/SuggestionCard';
import { playlists } from './data/playlists';
import { ApiResponse } from './type';

// import { subscribeUser, unsubscribeUser, sendNotification } from './actions'

// function urlBase64ToUint8Array(base64String: string) {
//   const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
//   const base64 = (base64String + padding)
//     .replace(/\\-/g, '+')
//     .replace(/_/g, '/')

//   const rawData = window.atob(base64)
//   const outputArray = new Uint8Array(rawData.length)

//   for (let i = 0; i < rawData.length; ++i) {
//     outputArray[i] = rawData.charCodeAt(i)
//   }
//   return outputArray
// }

// function PushNotificationManager() {
//     const [isSupported, setIsSupported] = useState(false)
//     const [subscription, setSubscription] = useState<PushSubscription | null>(
//       null
//     )
//     const [message, setMessage] = useState('')

//     useEffect(() => {
//       if ('serviceWorker' in navigator && 'PushManager' in window) {
//         setIsSupported(true)
//         registerServiceWorker()
//       }
//     }, [])

//     async function registerServiceWorker() {
//       const registration = await navigator.serviceWorker.register('/sw.js', {
//         scope: '/',
//         updateViaCache: 'none',
//       })
//       const sub = await registration.pushManager.getSubscription()
//       setSubscription(sub)
//     }

//     async function subscribeToPush() {
//       const registration = await navigator.serviceWorker.ready
//       const sub = await registration.pushManager.subscribe({
//         userVisibleOnly: true,
//         applicationServerKey: urlBase64ToUint8Array(
//           process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
//         ),
//       })
//       setSubscription(sub)
//       await subscribeUser(sub)
//     }

//     async function unsubscribeFromPush() {
//       await subscription?.unsubscribe()
//       setSubscription(null)
//       await unsubscribeUser()
//     }

//     async function sendTestNotification() {
//       if (subscription) {
//         await sendNotification(message)
//         setMessage('')
//       }
//     }

//     if (!isSupported) {
//       return <p>Push notifications are not supported in this browser.</p>
//     }

//     return (
//       <div>
//         <h3>Push Notifications</h3>
//         {subscription ? (
//           <>
//             <p>You are subscribed to push notifications.</p>
//             <button onClick={unsubscribeFromPush}>Unsubscribe</button>
//             <input
//               type="text"
//               placeholder="Enter notification message"
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//             />
//             <button onClick={sendTestNotification}>Send Test</button>
//           </>
//         ) : (
//           <>
//             <p>You are not subscribed to push notifications.</p>
//             <button onClick={subscribeToPush}>Subscribe</button>
//           </>
//         )}
//       </div>
//     )
// }
// function InstallPrompt() {
//     const [isIOS, setIsIOS] = useState(false)
//     const [isStandalone, setIsStandalone] = useState(false)

//     useEffect(() => {
//       setIsIOS(
//         /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
//       )

//       setIsStandalone(window.matchMedia('(display-mode: standalone)').matches)
//     }, [])

//     if (isStandalone) {
//       return null // Don't show install button if already installed
//     }

//     return (
//       <div>
//         <h3>Install App</h3>
//         <button>Add to Home Screen</button>
//         {isIOS && (
//           <p>
//             To install this app on your iOS device, tap the share button
//             <span role="img" aria-label="share icon">
//               {' '}
//               ⎋{' '}
//             </span>
//             and then "Add to Home Screen"
//             <span role="img" aria-label="plus icon">
//               {' '}
//               ➕{' '}
//             </span>.
//           </p>
//         )}
//       </div>
//     )
//   }

//   export default function Page() {
//     return (
//       <div>
//         <PushNotificationManager />
//         <InstallPrompt />
//       </div>
//     )
//   }
export default function MusicPage() {
    const [searchValue, setSearchValue] = useState('');
    const [musicUrl, setMusicUrl] = useState('');
    const [value] = useDebounce(searchValue, 500);

    const [isSearchSuggestionOpen, setSearchSuggestion] = useState(false);
    const [animationParent] = useAutoAnimate({
        duration: 100,
        easing: 'ease-in-out',
    });

    const ref = useOnclickOutside(() => {
        setSearchSuggestion(false);
    });

    const main_api = 'https://saavn.dev/api';

    const Loffi_API = `${main_api}/search/songs?query=loffi&page=1&limit=30`;
    const Trending_API = `${main_api}/search/songs?query=telugu&page=1&limit=30`;

    const SEARCH_API = `${main_api}/search/songs?query=${
        value || 'india'
    }&page=1&limit=50`;

    // Trending_API api
    const { isLoading: isTrending_APISongsLoading, data: trending_APISongs } =
        useQuery<ApiResponse>({
            queryKey: ['treading-song'],
            queryFn: () => fetch(Trending_API).then((res) => res.json()),
        });

    // Loffi_API api
    const { isLoading: isLoffiSongsLoading, data: loffiSongs } =
        useQuery<ApiResponse>({
            queryKey: ['loffi-song'],
            queryFn: () => fetch(Loffi_API).then((res) => res.json()),
        });
    // serach api
    const {
        isLoading: isSongsLoading,
        refetch: refetchSearch,
        data: songs,
    } = useQuery<ApiResponse>({
        queryKey: ['search-song'],
        queryFn: () => fetch(SEARCH_API).then((res) => res.json()),
    });

    useEffect(() => {
        refetchSearch();
    }, [refetchSearch, value]);

    function downloadImage(imgUrl: string, imageName: string) {
        saveAs(imgUrl, `${imageName}.mp3`);
    }
    return (
        <div className=" md:block">
            <Menu />
            <div className="border-t">
                <div className="bg-background">
                    <div className="grid grid-cols-1 lg:grid-cols-5">
                        <Sidebar
                            playlists={playlists}
                            className="hidden lg:block"
                        />
                        <div className="col-span-3 lg:col-span-4 lg:border-l">
                            <div className="h-full px-4 py-4 lg:px-8">
                                <Tabs
                                    defaultValue="music"
                                    className="h-full space-y-6"
                                >
                                    <div className="space-between  md:flex items-center">
                                        <TabsList className="my-1">
                                            <TabsTrigger
                                                value="music"
                                                className="relative"
                                            >
                                                Music
                                            </TabsTrigger>
                                            <TabsTrigger value="podcasts">
                                                Podcasts
                                            </TabsTrigger>
                                        </TabsList>
                                        <div ref={ref} className="w-full my-1">
                                            <div
                                                ref={animationParent}
                                                onClick={() =>
                                                    setSearchSuggestion(true)
                                                }
                                            >
                                                <Input
                                                    placeholder="Search Songs..."
                                                    className="w-full"
                                                    value={searchValue}
                                                    onChange={(e) =>
                                                        setSearchValue(
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                                {isSearchSuggestionOpen && (
                                                    <div className="absolute left-0 top-10 z-10 grid max-h-[300px] w-full grid-cols-1 gap-3 overflow-x-auto   rounded border bg-secondary   p-2 md:grid-cols-2 lg:grid-cols-3   ">
                                                        {isSongsLoading &&
                                                            'loading'}
                                                        {songs?.data.results.map(
                                                            (d, i) => (
                                                                <SuggestionCard
                                                                    key={i}
                                                                    handleDownload={() =>
                                                                        downloadImage(
                                                                            d
                                                                                .downloadUrl[4]
                                                                                .url,
                                                                            d.name
                                                                        )
                                                                    }
                                                                    onClick={() =>
                                                                        setMusicUrl(
                                                                            d
                                                                                .downloadUrl[4]
                                                                                .url
                                                                        )
                                                                    }
                                                                    img={
                                                                        d
                                                                            .image[1]
                                                                            .url
                                                                    }
                                                                    category={
                                                                        d.album
                                                                            .name
                                                                    }
                                                                    name={
                                                                        d.name
                                                                    }
                                                                />
                                                            )
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="my-1">
                                            <ModeToggle />
                                        </div>
                                    </div>
                                    <TabsContent
                                        value="music"
                                        className="border-none p-0 outline-none pb-32"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-1">
                                                <h2 className="text-2xl font-semibold tracking-tight">
                                                    Listen Now
                                                </h2>
                                                <p className="text-sm text-muted-foreground">
                                                    Top picks for you. Updated
                                                    daily.
                                                </p>
                                            </div>
                                        </div>
                                        <Separator className="my-4" />
                                        <div className="relative">
                                            <ScrollArea>
                                                <div className="flex space-x-4 pb-4">
                                                    {isLoffiSongsLoading
                                                        ? Array(6)
                                                              .fill(null)
                                                              .map((_, i) => (
                                                                  <LoadingAlbumArtwork
                                                                      key={i}
                                                                      className="w-[250px]"
                                                                      aspectRatio="portrait"
                                                                      width={
                                                                          250
                                                                      }
                                                                  />
                                                              ))
                                                        : loffiSongs?.data.results.map(
                                                              (d, i) => (
                                                                  <AlbumArtwork
                                                                      handleDownload={() =>
                                                                          downloadImage(
                                                                              d
                                                                                  .downloadUrl[4]
                                                                                  .url,
                                                                              d.name
                                                                          )
                                                                      }
                                                                      onClick={() =>
                                                                          setMusicUrl(
                                                                              d
                                                                                  .downloadUrl[4]
                                                                                  .url
                                                                          )
                                                                      }
                                                                      key={i}
                                                                      name={
                                                                          d.name
                                                                      }
                                                                      img={
                                                                          d
                                                                              .image[2]
                                                                              .url
                                                                      }
                                                                      category={
                                                                          d
                                                                              .album
                                                                              .name
                                                                      }
                                                                      className="w-[250px]"
                                                                      aspectRatio="portrait"
                                                                      width={
                                                                          250
                                                                      }
                                                                      height={
                                                                          330
                                                                      }
                                                                  />
                                                              )
                                                          )}
                                                </div>
                                                <ScrollBar orientation="horizontal" />
                                            </ScrollArea>
                                        </div>
                                        <div className="mt-6 space-y-1">
                                            <h2 className="text-2xl font-semibold tracking-tight">
                                                Made for You
                                            </h2>
                                            <p className="text-sm text-muted-foreground">
                                                Your personal playlists. Updated
                                                daily.
                                            </p>
                                        </div>
                                        <Separator className="my-4" />
                                        <div className="relative">
                                            <ScrollArea>
                                                <div className="flex space-x-4 pb-4">
                                                    {isTrending_APISongsLoading
                                                        ? Array(6)
                                                              .fill(null)
                                                              .map((_, i) => (
                                                                  <LoadingAlbumArtwork
                                                                      key={i}
                                                                      aspectRatio="portrait"
                                                                      width={
                                                                          150
                                                                      }
                                                                  />
                                                              ))
                                                        : trending_APISongs?.data.results.map(
                                                              (d, i) => (
                                                                  <AlbumArtwork
                                                                      handleDownload={() =>
                                                                          downloadImage(
                                                                              d
                                                                                  .downloadUrl[4]
                                                                                  .url,
                                                                              d.name
                                                                          )
                                                                      }
                                                                      onClick={() =>
                                                                          setMusicUrl(
                                                                              d
                                                                                  .downloadUrl[4]
                                                                                  .url
                                                                          )
                                                                      }
                                                                      key={i}
                                                                      name={
                                                                          d.name
                                                                      }
                                                                      img={
                                                                          d
                                                                              .image[2]
                                                                              .url
                                                                      }
                                                                      category={
                                                                          d
                                                                              .album
                                                                              .name
                                                                      }
                                                                      className="w-[150px]"
                                                                      aspectRatio="square"
                                                                      width={
                                                                          150
                                                                      }
                                                                      height={
                                                                          150
                                                                      }
                                                                  />
                                                              )
                                                          )}
                                                </div>
                                                <ScrollBar orientation="horizontal" />
                                            </ScrollArea>
                                        </div>
                                    </TabsContent>
                                    <TabsContent
                                        value="podcasts"
                                        className="h-full flex-col border-none p-0 data-[state=active]:flex"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-1">
                                                <h2 className="text-2xl font-semibold tracking-tight">
                                                    New Episodes
                                                </h2>
                                                <p className="text-sm text-muted-foreground">
                                                    Your favorite podcasts.
                                                    Updated daily.
                                                </p>
                                            </div>
                                        </div>
                                        <Separator className="my-4" />
                                        <PodcastEmptyPlaceholder />
                                    </TabsContent>
                                </Tabs>
                            </div>
                            <section className="fixed bottom-0 left-0 w-full">
                                <AudioPlayer
                                    className="!bg-background"
                                    src={musicUrl}
                                    onPlay={(e) => console.log('onPlay')}
                                />
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
