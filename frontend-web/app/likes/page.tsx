
import ReceivedLikesFeed from "@/components/organisms/receivedLikesFeed";

export default function LikesPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container max-w-2xl mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">I tuoi Mi piace</h1>
         
        </div>
       <ReceivedLikesFeed />
      </div>
    </main>
  );
}