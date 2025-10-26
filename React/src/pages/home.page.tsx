import { Gallery } from "../components/gallery.component"
import 'axios'
import axios from "axios";
import { useState, useEffect } from "react";

interface img {
    id: number,
    filename: string,
    date: Date,
    user: string
}

export const Home: React.FC = () => {

    const [refresh, setRefresh] = useState<boolean>(false);
    const [file, setFile] = useState<File>();

    const [sources, setSources] = useState<img[]>([]);

    const [user, setUser] = useState<string>("");
    const [about, setAbout] = useState(false);

    useEffect(() => {
        setUser("BRETT");

        axios.post('http://localhost:8081/user', {
            user: 'BRETT'
        })
            .then(res => {
                if (res.data.Status == 'Success') {
                    console.log('User Set Successfully: ' + res.data.data)
                } else {
                    console.log('User Set Failed')
                }
            });
        
        axios.get('http://localhost:8081/images')
            .then(res => {
                console.log(res.data);

                res.data.forEach(img => {
                    setSources(sources => [...sources, {id: img.id, filename: img.Image, date: new Date(img.date), user: img.user}]);
                });
            })
            .then(data => console.log("Retrieved images: " + data))
            .catch(err => console.log("Couldn't get images: " + err));
    }, []);

    useEffect(() => {

        setSources([]);
        
        if (refresh) {
            axios.get('http://localhost:8081/images')
                .then(res => {
                    console.log(res.data);

                    res.data.forEach(img => {
                        setSources(sources => [...sources, {id: img.id, filename: img.Image, date: new Date(img.date), user: img.user}]);
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

    const handleFile = (e) => {
        setFile(e.target.files[0]);
    }

    const handleUpload = () => {

        if (file == null) {
            return;
        }

        const formdata = new FormData();
        formdata.append('image', file as Blob);
        formdata.append('user', user as string)

        const date = new Date(file.lastModified);
        const dateString = date.toISOString().slice(0,19).replace('T',' ');
        //console.log(dateString);
        formdata.append('date', dateString as string)

        axios.post('http://localhost:8081/upload', formdata)
            .then(res => {
                if (res.data.Status == 'Success') {
                    console.log('Upload Successful:' + res.data.data)
                } else {
                    console.log('Upload Failed:' + res.data.err)
                }
            });
    }

    return (
        <>
            <title>
                Hello World!
            </title>
            <body>
                <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 p-6">
                    <div className="max-w-7xl mx-auto">
                        <header className="text-center mb-8">
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 title">
                            Brofie
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
                                            This project was made for my wonderful girlfriend Sophie (yes I know the 
                                            Brofie is spelt different). She's been my rock and my dance partner for 
                                            a year now and I wanted to make my personal project something I think she 
                                            would like to use! Although I'm sure it will be enjoyable for anyone to use. 
                                            If Sophie is reading this, I love you. Thank you for everything that has 
                                            passed and everything to come. - Brettan Cutchall
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