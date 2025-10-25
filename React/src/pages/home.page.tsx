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
    }, []);

    useEffect(() => {

        setSources([]);
        
        if (refresh) {
            axios.get('http://localhost:8081/images')
                .then(res => {
                    console.log(res.data);

                    res.data.forEach(img => {
                        setSources(sources => [...sources, {id: img.id, filename: img.Image, date: img.date, user: img.user}]);
                    });
                })
                .then(data => console.log("Retrieved images: " + data))
                .catch(err => console.log("Couldn't get images: " + err));

            setRefresh(false);
        }

    }, [refresh]);

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
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                            Brofie
                        </h1>
                        </header>
                    </div>
                    <div className="flex justify-center items-center h-20 bg-red-200 text-center my-5 mx-2 border-r-2">
                        <h3 className="text-black font-bold">
                            <button
                                onClick={() => setRefresh(true)}
                            >
                                Refresh
                            </button>
                        </h3>
                    </div>
                    <div className="h-full justify-center items-center text-center my-5 mx-2 border-r-2">
                        <Gallery 
                            sources={sources}
                        />
                    </div>
                    <div>
                        <input type="file" onChange={handleFile}/>
                        <button onClick={handleUpload}>Upload</button>
                    </div>
                </div>
            </body>
        </>
    )
}