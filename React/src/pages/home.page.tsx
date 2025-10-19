import { Gallery } from "../components/gallery.component"
import 'axios'
import axios from "axios";
import { useState, useEffect } from "react";

export const Home: React.FC = () => {

    const [refresh, setRefresh] = useState<boolean>(false);
    const [file, setFile] = useState<File>();

    const [sources, setSources] = useState<string[]>([]);

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
                        setSources(sources => [...sources, img.Image]);
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
        const formdata = new FormData();
        formdata.append('image', file as Blob);
        formdata.append('user', user as string)

        const date = new Date(file.lastModified);
        console.log(date);

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
                <div className="flex flex-col">
                    <h1 className="text-center text-2xl">
                        Testing
                    </h1>
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