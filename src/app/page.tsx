"use client";

import { useEffect, useState } from "react";
import albumsJson from "../resources/all_albums.json";
interface album {
  rank: string;
  title: string;
  artist: string;
  has_listened: boolean;
}

export default function Home() {
  const [albums, setAlbums] = useState(albumsJson);
  const [albumSearch, setAlbumSearch] = useState("");
  const [foundAlbum, setFoundAlbum] = useState<album>();
  const [haveListened, setHaveListened] = useState([] as album[]);
  const [haveNotListened, setHaveNotListened] = useState([] as album[]);

  useEffect(() => {
    const localAlbumsJson = localStorage.getItem("albums");
    const localAlbums = JSON.parse(localAlbumsJson as any);
    if (localAlbums) {
      console.log("list loaded from local storage");
      setAlbums(localAlbums);
    } else {
      console.log("list not found, set/created new list");
      localStorage.setItem("albums", JSON.stringify(albums));
    }
  }, []);

  const findAlbum = (searchedAlbum: string): album => {
    console.log("searched album");
    var temp: album = albums.find(
      (album) => album.title.toLowerCase() === searchedAlbum.toLowerCase()
    ) as album;
    return temp;
  };

  const updateStatus = async (album: album) => {
    const i: number = albums.indexOf(album);
    const tempArr = [...albums];
    tempArr[i] = {
      has_listened: !album.has_listened,
      title: album.title,
      artist: album.artist,
      rank: album.rank,
    };
    console.log(tempArr, i);
    setAlbums(tempArr);
    setFoundAlbum(tempArr[i]);
    setTimeout("100");
    try {
      localStorage.setItem("albums", JSON.stringify(tempArr));
    } catch {
      console.log("error setting local storage");
    }
  };

  const getRandomAlbum = () => {
    const randomI = Math.floor(Math.random() * 5392);
    console.log(randomI);
    setFoundAlbum(albums[randomI]);
  };

  return (
    <div className="flex flex-col items-center justify-center p-16 w-full">
      <button
        className="px-2 border rounded border-blue-400"
        onClick={() => {
          getRandomAlbum();
        }}
      >
        Get Random Album
      </button>

      <div className="m-16 flex flex-col w-full">
        <input
          value={albumSearch}
          onChange={(e) => {
            setAlbumSearch(e.target.value);
          }}
          type="text"
          name="searchInput"
          placeholder="Search Album Title"
          className="bg-black border rounded px-2 border-blue-400"
        />
        <button
          className="m-5 border rounded border-blue-400"
          onClick={() => {
            var temp = findAlbum(albumSearch);
            console.log(temp);
            setFoundAlbum(temp);
          }}
        >
          Search
        </button>
        {foundAlbum && (
          <div className="flex flex-col w-full text-blue-400">
            <h1 className="m-2">
              Title: <span className="text-white">{foundAlbum.title}</span>
            </h1>
            <h1 className="m-2 ">
              Artist: <span className="text-white">{foundAlbum.artist}</span>
            </h1>
            <div className="flex w-full justify-between m-2">
              Has Been Listened?{" "}
              <span
                className={
                  foundAlbum.has_listened ? "text-green-400" : "text-red-400"
                }
              >
                {foundAlbum.has_listened ? "True" : "False"}
              </span>
              <button
                className="border px-2 rounded mx-5 text-white border-blue-400"
                onClick={() => {
                  updateStatus(foundAlbum);
                }}
              >
                Switch
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="flex w-full justify-around text-center">
        <div className="flex flex-col w-5/12">
          <h1
            className="border rounded border-blue-400"
            onClick={() => {
              const listened = albums.filter(
                (album) => album.has_listened === true
              );
              console.log(listened);
              setHaveListened(listened);
            }}
          >
            Have listened
          </h1>
          <div>
            {haveListened &&
              haveListened.map((album, i) => {
                return (
                  <div
                    key={`${album.title}${i}`}
                    className="my-4"
                    onClick={() => {
                      setFoundAlbum(album);
                    }}
                  >
                    <p>
                      {i + 1}. {album.title}
                    </p>
                    <p className="text-blue-400"> - {album.artist}</p>
                  </div>
                );
              })}
          </div>
        </div>
        <div className="flex flex-col w-5/12">
          <h1
            className="border  rounded border-blue-400"
            onClick={() => {
              const notListened = albums.filter(
                (album) => album.has_listened === false
              );
              console.log(notListened);
              setHaveNotListened(notListened);
            }}
          >
            Have listened
          </h1>
          <div>
            {haveNotListened &&
              haveNotListened.map((album, i) => {
                return (
                  <div
                    key={`${album.title}${i}`}
                    className="my-4"
                    onClick={() => {
                      setFoundAlbum(album);
                    }}
                  >
                    <p>
                      {i + 1}. {album.title}
                    </p>
                    <p className="text-blue-400"> - {album.artist}</p>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
