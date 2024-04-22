import '@/src/global.css'
import Providers from '../components/Providers/Providers'

export default async function RootLayout({ children, }: {
    children: React.ReactNode
}) {
    return (
        <html
            lang='en'
        >
            <body>
                <Providers>
                    {children}
                </Providers>
            </body>
        </html >
    )
}
