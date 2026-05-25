import { useRef, useState } from "react";

export function CargarArchivo(props) {
    const { datos, control } = props
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);
    // const [previewFiles, setPreviewFiles] = useState([]);

    const handleButtonClickArchivo = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        // console.log(e);
        const files = Array.from(e.target.files);
        control((prev) => [...prev, ...files]);
    };

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        // setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files);
        const fakeEvent = { target: { files } };
        handleFileChange(fakeEvent);
    };

    const removeFile = (index) => {
        const updatedFiles = [...datos];
        updatedFiles.splice(index, 1);
        // console.log("50",updatedFiles,fileInputRef);
        control(updatedFiles);
    };

    return (
        <div
            className={datos.length == 0 ? "w-100 centrar pointer" : "w-100 centrar"}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={datos.length == 0 ? handleButtonClickArchivo : null}
            style={{
                border: isDragging ? '2px dashed #007bff' : '2px dashed #ccc',
                borderRadius: '8px',
                transition: '0.2s ease',
                minHeight: '117.6px'
            }}
        >
            {isDragging ? (
                <div className="caja-promps w-100 text-white d-flex align-items-center justify-content-center"
                    style={{
                        border: '2px dashed #007bff',
                        borderRadius: '8px',
                        minHeight: "117.6px"
                    }}>
                    <p><span>Arrastra tu archivo aquí</span></p>
                </div>
            ) : (
                <div className="w-100">
                    {/* {console.log(datos)} */}
                    <input
                        type="file"
                        accept="*/*"
                        multiple
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />
                    {datos.length > 0 ?
                        <div className="d-flex flex-wrap gap-3 p-2" style={{ maxHeight: "600px", overflow: "auto" }}>
                            {datos.map((file, index) => (
                                <div key={index} className="position-relative text-center d-flex align-items-center archivo-content">
                                    <span className="pi pi-file me-2"></span>
                                    <small>{file.name}</small>
                                    <span
                                        className="pi pi-times pointer text-danger ms-2"
                                        onClick={() => removeFile(index)}
                                    />
                                </div>
                            ))}
                        </div> :
                        <div className="text-center">
                            <div><span className="pi pi-image"></span> Selecciona o arrastra tus archivos</div>
                        </div>
                    }
                </div>
            )}
        </div>
    );
}