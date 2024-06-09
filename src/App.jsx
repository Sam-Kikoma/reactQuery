// '
import { useQuery, useMutation, QueryClient, useQueryClient } from '@tanstack/react-query'
const App = () => {
  const queryClient = useQueryClient()


  const searchFn = async ()=> {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts")
    return res.json()
  }

  const {data,error, isLoading} =useQuery({queryKey:["posts"], queryFn:searchFn, staleTime:4000})
  
  const { mutate, isPending, isError} = useMutation({
    mutationFn: async (newPost) => {
      const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newPost)
      })
      return res.json()
    },
    // Refetch on successful post
    // onSuccess: ()=> {
    //   queryClient.invalidateQueries({queryKey: ["posts"]})
    // }
    onSuccess: (newPost)=> {
      queryClient.setQueryData(["posts"], (oldPosts)=>{
        [...oldPosts,newPost]
      })
    }
  })

  if(error||isError) return <div>There was an error</div>
  if(isLoading) return <div>Data is loading</div>

  return (
<>
  {isPending && <p>Data is being added</p>}
  <button onClick={()=>mutate({
    "userId": 101,
    "id": 101,
    "title": "Custom post",
    "body": "This is a custom post"
  })}>Add Post</button>
      <div>
        {data.map((post) => (
          <div key={post.id}><span>{post.id}</span> : {post.title} <p>{post.body}</p></div>
        ))}
      </div>
</>
  )
}

export default App