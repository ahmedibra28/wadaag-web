import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Wadaag App</title>
        <meta name='description' content='Wadaag App for web-based' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title} style={{ color: '#a5a4a4' }}>
          web-based <span style={{ color: '#FFF' }}> wadaag app</span>
        </h1>
        <h3 style={{ color: '#a5a4a4' }}>coming soon</h3>
      </main>

      <footer className={styles.footer}>
        <a
          href='https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app'
          target='_blank'
          rel='noopener noreferrer'
        >
          Powered by websom.dev
        </a>
      </footer>
    </div>
  )
}
