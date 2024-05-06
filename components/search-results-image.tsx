/* eslint-disable @next/next/no-img-element */
'use client'

import { Card, CardContent } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from '@/components/ui/carousel'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { PlusCircle } from 'lucide-react'
import { useEffect, useState } from 'react'

interface SearchResultsImageSectionProps {
  images: string[]
  query?: string
}

export const SearchResultsImageSection: React.FC<
  SearchResultsImageSectionProps
> = ({ images, query }) => {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)
  const [selectedIndex, setSelectedIndex] = useState(0)

  // Update the current and count state when the carousel api is available
  useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  // Scroll to the selected index
  useEffect(() => {
    if (api) {
      api.scrollTo(selectedIndex, true)
    }
  }, [api, selectedIndex])

  if (!images || images.length === 0) {
    return (
      <div className="text-muted-foreground">No se encontraron imágenes</div>
    )
  }

  return (
    <div className="flex flex-wrap gap-2">
      {images.slice(0, 4).map((image: any, index: number) => (
        <Dialog key={index}>
          <DialogTrigger asChild>
            <div
              className="w-[calc(50%-0.5rem)] md:w-[calc(25%-0.5rem)] aspect-video cursor-pointer relative"
              onClick={() => setSelectedIndex(index)}
            >
              <Card className="flex-1 h-full">
                <CardContent className="p-2 size-full">
                  {image ? (
                    <img
                      src={image}
                      alt={`Imagen ${index + 1}`}
                      className="size-full object-cover"
                      onError={e =>
                        (e.currentTarget.src = '/images/placeholder-image.png')
                      }
                    />
                  ) : (
                    <div className="size-full bg-muted animate-pulse" />
                  )}
                </CardContent>
              </Card>
              {index === 3 && images.length > 4 && (
                <div className="absolute inset-0 bg-black/30 rounded-md flex items-center justify-center text-white/80 text-sm">
                  <PlusCircle size={24} />
                </div>
              )}
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>Buscar imágenes</DialogTitle>
              <DialogDescription className="text-sm">{query}</DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Carousel
                setApi={setApi}
                className="w-full bg-muted max-h-[60vh]"
              >
                <CarouselContent>
                  {images.map((img, idx) => (
                    <CarouselItem key={idx}>
                      <div className="p-1 flex items-center justify-center h-full">
                        <img
                          src={img}
                          alt={`Imagen ${idx + 1}`}
                          className="h-auto w-full object-contain max-h-[60vh]"
                          onError={e =>
                            (e.currentTarget.src =
                              '/images/placeholder-image.png')
                          }
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="absolute inset-8 flex items-center justify-between p-4">
                  <CarouselPrevious className="size-10 rounded-full shadow focus:outline-none">
                    <span className="sr-only">Anterior</span>
                  </CarouselPrevious>
                  <CarouselNext className="size-10 rounded-full shadow focus:outline-none">
                    <span className="sr-only">Siguiente</span>
                  </CarouselNext>
                </div>
              </Carousel>
              <div className="py-2 text-center text-sm text-muted-foreground">
                {current} de {count}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  )
}
