//import { useState, useEffect } from "react";

interface GalleryProps {
    sources: string[];
}

export const Gallery: React.FC<GalleryProps> = ({
    sources,
  }) => {

    //const [images, setImages] = useState<string[]>([]);
    const pictures = sources.map((pic) => {
        const source = "../../images/" + pic;

        return (
            <img src={source} />
        );
    });

    return (
        <>
            <div className="grid grid-cols-5">
                {pictures}
            </div>
        </>
    )
}