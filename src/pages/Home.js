import { useEffect, useState, useRef, useCallback } from 'react'
import Book from '../components/Book'
import './home.css'
import axios from 'axios'
import MeiliSearch from "meilisearch";

const MEILISEARCH_HOST = 'http://52.15.54.185/';
const MEILISEARCH_API_KEY = 'f5e181da4165526ba3e6f1d456c7f712bb580b0efeefd5e82718bad2afa9b9ad';
const BOOKS_PER_PAGE = 15;

function Home() {
  const [books, setBooks] = useState([])
  const URL = "http://localhost:1337/api/books"
  const observerElem = useRef(null)
  const [hasNextPage, setHasNextPage] = useState(true)
  const [offset, setOffset] = useState(0)
  const [lastPage, setLastPage] = useState({})

  const fetchData = useCallback(async () => {
    const client = new MeiliSearch({
      host: MEILISEARCH_HOST,
      apiKey: MEILISEARCH_API_KEY,
    })
    const index = await client.getIndex('book')
    const booksData = await index.search('*', {
      limit: BOOKS_PER_PAGE,
      offset: offset 
    })
    setBooks(prevBooks => [...prevBooks,  ...booksData.hits])
    setLastPage(booksData)
  }, [offset])

  useEffect(() => {
    setOffset(books.length)
    setHasNextPage(books.length < lastPage.estimatedTotalHits)
  }, [books, lastPage.estimatedTotalHits])

  const handleObserver = useCallback((entries) => {
    const target = entries[0]
    if(target.isIntersecting && hasNextPage) {
      fetchData()
    }
  }, [fetchData, hasNextPage])

  useEffect(() => {
    const element = observerElem.current
    const option = { threshold: 0 }
    const observer = new IntersectionObserver(handleObserver, option);
    observer.observe(element)
    return () => observer.unobserve(element)
  }, [hasNextPage, handleObserver])

  const sendData = useCallback(async () => {
    const fetchCol = await axios.get(URL)
    const fetchedData = fetchCol.data.data

    if (!fetchedData.length) {
      try {
        books.forEach((book) => {
          axios.post(URL,{
          data: {
            authors: book.authors,
            description: book.description,
            image: book.image,
            previewLink: book.previewLink,
            publishDate: book.publishDate,
            publisher: book.publisher,
            subtitle: book.subtitle,
            title: book.title,
          }})
        })
        console.log('done')
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("data already uploadedd")
    }
  }, [books, URL])

  useEffect(() => {
    fetchData()
    sendData()
  }, [fetchData, sendData])

  return (
    <div className='home'>
      <div className='hero wrapper'>
        <div className='wrapper'>
          <div className='hero__text'>
            <h2>React books library</h2>
            <p>Get all the React books you need in one place</p>
          </div>
          <img src='/readingBook.png' alt='hero'/>
        </div>
      </div>  

      <div className='allBooks wrapper'>
        <h2>Browse books</h2>
        <div className='books'>
          {books?.map((book) => (
            <Book
              key={book.id}
              title={book.title}
              image={book.image}
              authors={book.authors}
              publisher={book.publisher}
              publishDate={book.publishedDate}
              id={book.id}
            />
          ))}
        </div>
        
          <div className='loader' ref={observerElem}>
            {books.length !== 0 &&
              <span>{hasNextPage ? 'Loading...' : 'no books left'}</span>
            }
          </div>
      </div>
    </div> 
  )
}

export default Home