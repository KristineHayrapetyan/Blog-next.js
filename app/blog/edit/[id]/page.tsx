'use client';


import {useRouter} from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import {Toaster, toast} from 'react-hot-toast';

interface UpdateBlog{
    id: string;
    title: string;
    description: string
}

const deleteBlog = async(id: string)=>{
    const res = await fetch('http://localhost:3000/api/blog/'+id, {
        method: 'DELETE'
    });

    return res.json();
}

const getBlogById = async(id: string)=>{    
    const res = await fetch('http://localhost:3000/api/blog/'+ id);
    const data = await res.json();
    return data.post;
} 

const updateBlog = async({id, title, description}: UpdateBlog)=>{
    const res = await fetch('http://localhost:3000/api/blog/' + id, {
        method: 'PUT',
        body: JSON.stringify({title, description}),
        // @ts-ignore
        'Content-Type': 'application/json'
    });

    return await res.json();

}


function EditBlog({params}: {params: {id: string}}){
    const router = useRouter();
    const titleRef = useRef<HTMLInputElement | null>(null);
    const descriptionRef = useRef<HTMLTextAreaElement | null>(null);

    useEffect(()=>{
        toast.loading('Fetching Blog Detail', {id:'1'});
        getBlogById(params.id).then(data=>{
            if(titleRef.current && descriptionRef.current){
                titleRef.current.value = data.title;
                descriptionRef.current.value = data.description;
                toast.success('Fetching Completed!!!', {id:'1'});
            }
        }).catch(err=>{
            console.log(err);
            toast.error('Error fetching blog', {id: '1'})
        });
    }, []);

    
    const submitHandler = async(e: any)=>{
        e.preventDefault();

        if (titleRef.current && descriptionRef.current){
            toast.loading('Sending Request', {id: '2'});
            await updateBlog({
                id: params.id,
                title: titleRef.current.value,
                description: descriptionRef.current.value
            })
            toast.success('Blog Posted Successfully', {id: '2'});
            await router.push('/')
        }

    }

    const deleteHandler = async()=>{
        toast.loading('Sending Request', {id: '3'});
        await deleteBlog(params.id);
        toast.success('Blog Posted Deleted!!!!', {id: '3'});
        await router.push('/');
    }

    return (
        <>
            <Toaster />
            <h2>Edit Blog Page</h2>
            <form onSubmit={submitHandler}>
                <input type='text' placeholder='Enter title' ref={titleRef} />
                <textarea placeholder='Enter descr' ref={descriptionRef} />
                <button type='submit'>SAVE</button>
            </form>
            <button onClick = {deleteHandler}>DELETE</button>  
        </>
    );

}

export default EditBlog;

