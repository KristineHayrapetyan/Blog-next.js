import Link from 'next/link';


async function fetchBlogs() {
    const res = await fetch('http://localhost:3000/api/blog', {
      next:{
        revalidate: 10
      }
    });
    const data = await res.json();
    return data.posts;
}


export default async function Home() {

  const posts = await fetchBlogs();

  return (
    <main className="">
      <Link href={'/blog/add'} className=' bg-orange' >Add New Blog</Link>
      {
        posts?.map( (el: any)=>< div key={el.id} className='border-2 border-orange-300 m-2'>
          <div>{el.title}</div> 
          <div>{el.description}</div> 
          <Link href={'/blog/edit/' + el.id} className=' bg-orange' >Edit</Link>
        </div> )
      }
    </main>
  )
}
