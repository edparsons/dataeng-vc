'use client';

import * as React from "react"

import { FirmForm } from "./FirmForm"
import { ToolsForm } from "./ToolsForm"
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "@/src/components/ui/carousel";
import { Card, CardHeader, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { createClient } from "@supabase/supabase-js"
import { Database } from "@/src/types_db";
import { env } from "@/src/env";

const supabase = createClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

export const Form = () => {
    const [api, setApi] = React.useState<CarouselApi>()
    const [currentIndex, setCurrentIndex] = React.useState(0)
  const [maxIndex, setMaxIndex] = React.useState(1)
  const [data, setData] = React.useState<Record<string, any>>({})
  const [tools, setTools] = React.useState<Database['public']['Tables']['tools']['Row'][]>([])

  React.useEffect(() => {
    const fetchTools = async () => {
      const { data: tools, error } = await supabase.from('tools').select()
      if (error) {
        console.error('Error fetching tools:', error)
        return
      }
      setTools(tools ?? [])
    }
    fetchTools()
  }, []);


  React.useEffect(() => {
    if (!api) {
      return
    }
 
    api.on("select", () => {
        setCurrentIndex(api.selectedScrollSnap())
    })
  }, [api])

  const submit = (_data: any) => {
    if (currentIndex === 0) {
      setData({...data, ..._data})
    } else {
      setData({...data, tools: [...(data.tools ?? []), _data]})
    }
    if (currentIndex + 1 === maxIndex) {
        // wait for animation to finish
        setTimeout(() => {
            setMaxIndex(maxIndex + 1)
        }, 1000)
    }
    api?.scrollTo(currentIndex + 1)
    setCurrentIndex(currentIndex + 1)
    window.scrollTo(0, 0);
  }

  return (
    <>
    <Carousel setApi={setApi}>
        <CarouselContent>
            <CarouselItem>
            <Card>
                <CardHeader>Basics</CardHeader>
                <CardContent>
                    <FirmForm submit={submit} />
                </CardContent>
                </Card>

                </CarouselItem>
            { new Array(maxIndex+1).fill(null).map((_, index) => {
                return <CarouselItem key={index}>
                                <Card>
                <CardHeader><div className="flex flex-row justify-between items-center">
                    <div>
                    Tool #{index + 1}{data.tools?.[index]?.toolVendor ? `: ${data.tools?.[index]?.toolVendor}` : ''}
                    </div>
                    <Button>Finish</Button>
                    </div>
                </CardHeader>
                <CardContent>
                <ToolsForm submit={submit} index={index} data={data.tools?.[index]} tools={tools} back={() => {
                    // index is already 1 less as index is just counting tools, and scroll to is counting slides
                    api?.scrollTo(index)
                    setCurrentIndex(index)
                }} />
                </CardContent>
                </Card>


                </CarouselItem>
            })}
        </CarouselContent>
    </Carousel>
    <pre>
        current index: {currentIndex}
        max index: {maxIndex}
        {JSON.stringify(data, null, 2)}
    </pre>
    </>
  )
}

