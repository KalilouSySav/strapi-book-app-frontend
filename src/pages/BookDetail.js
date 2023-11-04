import {useParams} from 'react-router-dom'
import { useEffect, useState } from 'react'
import MeiliSearch from 'meilisearch'
import './bookDetail.css'

function BookDetail() {
  const [book, setBook] = useState({})
  const params = useParams()

  useEffect(() => {
    const fetchData = async () => {
      const client = new MeiliSearch({
        host: 'https://kss-meilisearch-dev-001.azurewebsites.net/',
        apiKey: '92d88d35-04aa-4fff-bb6e-a147017316e1',
      })
      const index = await client.getIndex('book')
      const bookData = await index.getDocument(`book-${params.id}`)
      setBook(bookData)
    }
    fetchData()
  }, [params])
  
  return (
    <div className='bookDetail wrapper'>
      <div className='bookDetail__top'>
        <img src={book.image} alt='book'/>

        <div className='bookDetail__topDec'>
          <h3>{book.title}</h3>
          <p>{book.subtitle}</p>
          <div className='bookDetail__authors'>
              By: {book.authors?.map((author, i) => (
              <span key={i}>{author}</span>
            ))}
          </div>
          <span>{book.publisher}, {book.publishedDate}</span>
          <a href={book.previewLink} className='sourceLink'>View in Source</a>
        </div>
      </div>

      <div className='bookDetail__bottomDec'>
        <h4>Description</h4>
        <p>{book.description}</p>
      </div>
    </div>
  )
}

export default BookDetail