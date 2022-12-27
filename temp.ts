import { serve } from "https://deno.land/std@0.155.0/http/server.ts";


const script = await Deno.readTextFile("./code.js")
const html = `<script type='module'>\n${script}\n</script>`


serve( (_req: Request) => {
    //console.log(req)
    return new Response(html, {
        headers: new Headers({'Content-Type': 'text/html'}),
        status: 200
    })
})
