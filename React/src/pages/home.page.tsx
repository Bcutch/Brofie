import { Gallery } from "../components/gallery.component"
import axios from "axios";
import { useState, useEffect } from "react";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

interface img {
    id: number,
    filename: string,
    date: Date,
    user: string,
    image: string
}

interface ApiImageData {
    id: number,
    image: string,
    date: string,
    user: string,
    imageUrl: string
}

export const Home: React.FC = () => {

    const auth = getAuth();
    const user = auth.currentUser;
    const name = user?.displayName

    const navigate = useNavigate()

    const [refresh, setRefresh] = useState<boolean>(false);
    const [file, setFile] = useState<File>();

    const [sources, setSources] = useState<img[]>([]);
    const [about, setAbout] = useState(false);

    useEffect(() => {

        if (getAuth().currentUser == null) {
            navigate("/")
        }

        axios.get('https://brophiebackend.vercel.app/images')
            .then(res => {
                console.log(res.data.images);

                res.data.images.forEach((img: ApiImageData) => {
                    setSources(sources => [...sources, {id: img.id, filename: img.image, date: new Date(img.date), user: img.user, image: img.imageUrl}]);
                });
            })
            .then(data => console.log("Retrieved images: " + data))
            .catch(err => console.log("Couldn't get images: " + err))

    }, []);

    useEffect(() => {
        setSources([]);
        
        if (refresh) {
            axios.get('https://brophiebackend.vercel.app/images')
                .then(res => {
                    console.log(res.data.images);

                    res.data.images.forEach((img: ApiImageData) => {
                        setSources(sources => [...sources, {id: img.id, filename: img.image, date: new Date(img.date), user: img.user, image: img.imageUrl}]);
                    });
                })
                .then(data => console.log("Retrieved images: " + data))
                .catch(err => console.log("Couldn't get images: " + err));

            setRefresh(false);
        }

    }, [refresh]);

    const handleRandom = () => {
        const shuffled = [...sources]; // Create a copy to avoid mutating original
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap elements
        }
        
        setSources(shuffled);
    }

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    }

    const handleUpload = () => {

        if (file == null) {
            return;
        }

        const formdata = new FormData();
        formdata.append('image', file as Blob);
        formdata.append('user', user!.uid as string)

        const date = new Date(file.lastModified);
        const dateString = date.toISOString().slice(0,10);
        //console.log(dateString);
        formdata.append('date', dateString as string)

        axios.post('https://brophiebackend.vercel.app/upload', formdata)
            .then(res => {
                if (res.data.Status == 'Success') {
                    console.log('Upload Successful:' + res.data.data)
                } else {
                    console.log('Upload Failed:' + res.data.err)
                }
            }).catch((err)=>{
                console.log(err)
            });
    }

    return (
        <>
            <title>
                Brophie!
            </title>
            <body>
                <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 p-6">
                    <div className="max-w-7xl mx-auto">
                        <header className="text-center mb-8">
                            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 title">
                                Welcome {name}
                            </h1>
                        </header>
                    </div>
                    <div className="flex justify-center items-center h-20 bg-purple-200 text-center my-5 mx-2 border-r-2">
                        <h3 className="text-black font-bold">
                            <button
                                onClick={() => setRefresh(true)}
                            >
                                Ordered
                            </button>
                        </h3>
                    </div>
                    <div className="flex justify-center items-center h-20 bg-purple-200 text-center mx-2 border-r-2">
                        <h3 className="text-black font-bold">
                            <button
                                onClick={handleRandom}
                            >
                                Randomize
                            </button>
                        </h3>
                    </div>
                    <div className="h-full justify-center items-center text-center my-5 mx-2 border-r-2">
                        <Gallery 
                            sources={sources}
                        />
                    </div>
                    <div className="flex justify-between items-center">
                        <input type="file" onChange={handleFile}/>
                        <button onClick={handleUpload}>Upload</button>
                        <div className="w-full">
                            
                        </div>
                        <button className="w-50" onClick={()=>setAbout(true)}>
                            About Brofie!
                        </button>
                    </div>
                    <div className="flex mt-5 justify-end items-end">
                        <button className="w-30 text-red-300" onClick={()=>{
                            signOut(auth).then(() => {
                                navigate("/")
                            })
                        }}>
                            Sign Out
                        </button>
                    </div>
                    {about && (
                        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                            <div className="max-w-4xl max-h-full bg-gradient-to-br from-purple-800 to-indigo-900 rounded-2xl overflow-hidden border border-purple-500">
                                <div className="relative">
                                    <button
                                        onClick={() => setAbout(false)}
                                        className="absolute top-4 right-4 z-10 w-8 h-8 bg-purple-700/80 hover:bg-purple-600 rounded-full flex items-center justify-center text-white transition-colors duration-200 backdrop-blur-sm"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                    <div className="p-6 pt-15">
                                        <p>
                                            This project was made for my wonderful girlfriend Sophie. She's been my rock and my dance partner for 
                                            a year now and I wanted to make my personal project something I think she 
                                            would like to use! Although I'm sure it will be enjoyable for anyone to use. 
                                            If Sophie is reading this, I love you. Thank you for everything that has 
                                            passed and everything to come. 
                                        </p>
                                        <p>
                                            - Brettan Cutchall
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </body>
        </>
    )
}
