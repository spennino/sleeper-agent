export default function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-700 bg-gray-900 py-6">
      <div className="container mx-auto px-4 text-center text-gray-400">
        <p>
          Feature requests, bug reports, or feedback, my DMs are open –{' '}
          <a
            href="https://twitter.com/seanpennino"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            @seanpennino
          </a>
        </p>
      </div>
    </footer>
  )
}