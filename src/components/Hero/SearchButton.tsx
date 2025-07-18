"use client"
import { ArrowRight, Search, Play } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import Button from "../ui/Button";
import { fetchVideoId } from "~/lib/helpers/transcript";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useToast } from "../ui/use-toast";
import { motion } from "framer-motion";

const SearchButton = () => {
  const { data: session, update, status } = useSession();
  const { toast } = useToast();
  const [url, seturl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      toast({
        title: "Please enter a video URL",
        description: "Paste a YouTube video URL to get started",
      });
      return;
    }

    if (session == undefined || session == null) {
      toast({
        title: "Please Sign In",
        description: "You need to sign in to use this feature",
      });
      router.push("/api/auth/signin");
      return;
    }

    setIsLoading(true);
    
    try {
      // Navigate to /watch route with the video URL as parameter
      const encodedUrl = encodeURIComponent(url.trim());
      router.push(`/watch?url=${encodedUrl}`);
    } catch (error) {
      toast({
        title: "Invalid Video URL",
        description: "Please enter a valid YouTube video URL",
      });
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.0 }}
      className="w-full max-w-2xl mx-auto"
    >
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row items-center gap-4 p-2 glass rounded-2xl shadow-glass"
      >
        <div className="flex-1 relative w-full">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={url}
            onChange={(e) => seturl(e.target.value)}
            placeholder="Paste your YouTube video URL here..."
            className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-300"
            disabled={isLoading}
          />
        </div>

        <motion.button
          type="submit"
          disabled={!url.trim() || isLoading}
          className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2"
          whileHover={{ scale: url.trim() && !isLoading ? 1.05 : 1 }}
          whileTap={{ scale: url.trim() && !isLoading ? 0.95 : 1 }}
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              Transform Video
            </>
          )}
        </motion.button>
      </form>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.4 }}
        className="text-center text-gray-500 text-sm mt-4"
      >
        Supports YouTube videos • Free to start • No credit card required
      </motion.p>
    </motion.div>
  );
}

export default SearchButton;