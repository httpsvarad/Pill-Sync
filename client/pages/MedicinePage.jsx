import React, { useEffect } from 'react'
import useStore from '../store/useStore';
import { use } from 'react';

const MedicinePage = () => {
    const { user, medicines, getMedicines } = useStore();

    console.log(user._id);

    useEffect(() => {
        getMedicines(user._id)
    }, [user._id]);

    console.log(medicines);
    
    // useEffect(() => {
    //     getMedicines(user.id);
    // }, []);
    return (
        <div>MedicinePage</div>
    )
}

export default MedicinePage