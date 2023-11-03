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
        host: 'https://52.15.54.185/',
        apiKey: 'f5e181da4165526ba3e6f1d456c7f712bb580b0efeefd5e82718bad2afa9b9ad',
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