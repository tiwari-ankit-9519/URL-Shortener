import axios from "axios";
import { useState } from "react";

interface ShortURL {
  id: number;
  originalUrl: string;
  shortUrl: string;
  uniqueId: string;
}

export default function App() {
  const [url, setUrl] = useState("");
  const [data, setData] = useState<ShortURL | null>(null);
  const [isShortend, setIsShortend] = useState(false);

  const handleButtonClick = async () => {
    const originalUrl = url;
    console.log(originalUrl);
    const response = await axios.post(`http://localhost:4000`, { originalUrl });
    setIsShortend(true);
    setData(response.data);
    setUrl("");
  };

  const hanldeUniqueIdClick = (id: string) => {
    if (isShortend && data) {
      window.location.href = `http://localhost:4000/${id}`;
    } else {
      alert("Please shorten the url first");
    }
  };

  return (
    <>
      <main className="flex justify-center items-center flex-col">
        <h1 className="font-medium text-5xl text-center mt-10">
          My URL Shortener
        </h1>
        <section className="flex justify-center items-center sm:w-1/3 w-full mt-20 p-5">
          <div className="flex gap-5 items-center w-full">
            <label className="text-xl font-medium">URL</label>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              type="text"
              className="border border-blue-600 focus:border-blue-500 focus: outline-none px-4 py-2 w-full"
              placeholder="Enter the URL you need to shorten"
            />
          </div>
        </section>
        <div className={`data: ? mb-10 : mt-0`}>
          {data ? (
            <p
              onClick={() => hanldeUniqueIdClick(data.uniqueId)}
              className="cursor-pointer"
            >
              <span className="font-semibold">Shorten URL:</span>{" "}
              <span className="underline text-blue-500">{data.uniqueId}</span>
            </p>
          ) : (
            ""
          )}
        </div>
        <button
          className="px-4 py-2 bg-zinc-800 hover:bg-zinc-900 text-white rounded"
          onClick={handleButtonClick}
        >
          Shorten the URL
        </button>
      </main>
    </>
  );
}
