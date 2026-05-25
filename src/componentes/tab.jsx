"use client";
import React from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { Image } from 'primereact/image';

const maestros = [
    { clase: "Yoga", icono: "pi pi-crown mr-2", maestro: { nombre: "Nombre maestro", imagen: "/yoga/yoga1.jpg", facebook: "/", twitter: "/", instagram: "/", whatsapp: "/" }, descripcion: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam,eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemoenim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos quiratione voluptatem sequi nesciunt. Consectetur, adipisci velit, sed quia non numquam eius modi.", clases: ["/yoga/yoga1.jpg", "/yoga/yoga2.jpg"] },
    { clase: "Pole fitness", icono: "pi pi-crown mr-2", maestro: { nombre: "Nombre maestro", imagen: "/fitnnes/fitnnes1.jpg", facebook: "/", twitter: "/", instagram: "/", whatsapp: "/" }, descripcion: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam,eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemoenim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos quiratione voluptatem sequi nesciunt. Consectetur, adipisci velit, sed quia non numquam eius modi.", clases: ["/fitnnes/fitnnes1.jpg", "/fitnnes/fitnnes2.jpg"] },
    { clase: "Acrobacia en tela", icono: "pi pi-crown mr-2", maestro: { nombre: "Nombre maestro", imagen: "/telas/telas1.jpg", facebook: "/", twitter: "/", instagram: "/", whatsapp: "/" }, descripcion: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam,eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemoenim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos quiratione voluptatem sequi nesciunt. Consectetur, adipisci velit, sed quia non numquam eius modi.", clases: ["/telas/telas1.jpg", "/telas/telas2.jpg"] },
    { clase: "Hammock / Acrobacia en tela", icono: "pi pi-crown mr-2", maestro: { nombre: "Nombre maestro", imagen: "/hammok/ha1.jpg", facebook: "/", twitter: "/", instagram: "/", whatsapp: "/" }, descripcion: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam,eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemoenim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos quiratione voluptatem sequi nesciunt. Consectetur, adipisci velit, sed quia non numquam eius modi.", clases: ["/hammok/ha1.jpg"] },
    { clase: "Pole exotic", icono: "pi pi-crown mr-2", maestro: { nombre: "Nombre maestro", imagen: "/exotic/ex1.jpg", facebook: "/", twitter: "/", instagram: "/", whatsapp: "/" }, descripcion: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam,eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemoenim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos quiratione voluptatem sequi nesciunt. Consectetur, adipisci velit, sed quia non numquam eius modi.", clases: ["/exotic/ex1.jpg"] },
    { clase: "Aerial kids", icono: "pi pi-crown mr-2", maestro: { nombre: "Nombre maestro", imagen: "/kids/kids1.jpg", facebook: "/", twitter: "/", instagram: "/", whatsapp: "/" }, descripcion: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam,eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemoenim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos quiratione voluptatem sequi nesciunt. Consectetur, adipisci velit, sed quia non numquam eius modi.", clases: ["/kids/kids1.jpg", "/kids/kids2.jpg"] },
    { clase: "Aro aereo", icono: "pi pi-crown mr-2", maestro: { nombre: "Nombre maestro", imagen: "/aro/aro1.jpg", facebook: "/", twitter: "/", instagram: "/", whatsapp: "/" }, descripcion: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam,eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemoenim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos quiratione voluptatem sequi nesciunt. Consectetur, adipisci velit, sed quia non numquam eius modi.", clases: ["/aro/aro1.jpg", "/aro/aro2.jpg"] },
]
export default function TabHome() {
    return (
        <div className="card">
            <TabView scrollable>
                {maestros.map((e, i) => {
                    return (
                        <TabPanel key={"maestro" + i} header={e.clase} leftIcon={e.icono}>
                            <div className='row'>
                                <div className='col col-12 col-md-6'>
                                    <h4 className='text-dual'>Maestro</h4>
                                    <p>{e.maestro.nombre}</p>
                                    {e.maestro.imagen !== "" ?
                                        <Image src={e.maestro.imagen} width='100%' height='400px' /> :
                                        <span className='pi pi-user' style={{ width: "100%", height: "400px" }}></span>
                                    }
                                    <h5 className='text-dual'>Redes</h5>
                                    <div>
                                        {e.maestro.facebook !== "" && <a href='/'><span className='pi pi-facebook me-2'></span></a>}
                                        {e.maestro.twitter !== "" && <a href='/'> <span className='pi pi-twitter me-2'></span></a>}
                                        {e.maestro.instagram !== "" && <a href='/'> <span className='pi pi-instagram me-2'></span></a>}
                                        {e.maestro.whatsapp !== "" && <a href='/'> <span className='pi pi-whatsapp me-2'></span></a>}
                                    </div>
                                </div>
                                <div className='col col-12 col-md-6'>
                                    <strong className='text-dual'>Descripciòn</strong>
                                    <p className="m-0">
                                        {e.descripcion}
                                    </p>
                                    <div className="row">
                                        {e.clases.map((a, b) => {
                                            return (
                                                <div key={"clases" + b} className='col col-md-3'>
                                                    <Image src={a} zoomSrc={a} alt={"Image" + b} width="80" height="60" preview className='me-3' />
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        </TabPanel>
                    )
                })}
            </TabView>
        </div>
    )
}
