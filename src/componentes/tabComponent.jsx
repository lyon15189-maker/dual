'use client';
import React, { useState } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';

export default function TabComponent({ data, control }) {

    return (
        <div className="">
            <TabView activeIndex={data.index} onTabChange={(e) => control({ ...data, index: e.index })} className='p-0'>
                {data?.labels?.map((e, i) => (
                    <TabPanel key={"tabs" + i} header={e} className='p-0'/>

                ))}
            </TabView>
        </div>
    )
}
