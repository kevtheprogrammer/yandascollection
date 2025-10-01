
import React from 'react'
 
import ApplicationLayout from './ApplicationLayout';
 

const layout = async({ children }: { children: React.ReactNode }) => {
    

    return <ApplicationLayout >
        {children}
    </ApplicationLayout>;

}

export default layout