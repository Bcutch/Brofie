import { Gallery } from "../components/gallery.component"
import fs from 'node:fs';

import { useState, useEffect } from "react";

export const Home: React.FC = () => {

    const [sources, setSources] = useState<string[]>([]);
    const [refresh, setRefresh] = useState<boolean>(false);

    async function fileList() {
        const files: string[] = [];
        await fs.readdir("../../images", (err, fileList) => {
            if (err) {
                console.log(err);
            } else {
                fileList.forEach(file => {
                    files.push(file);
                });
            }
        });

        setSources(files);
    };

    useEffect(() => {
        
        if (refresh) {
            setSources(["test.jpg", "test2.jpg"]);
            setRefresh(false);
        }

    }, [refresh]);

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
                    <div className="justify-center items-center h-20 text-center my-5 mx-2 border-r-2">
                        <Gallery 
                            sources={sources}
                        />
                    </div>
                </div>
            </body>
        </>
    )
}