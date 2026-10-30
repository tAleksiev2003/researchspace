"use strict";(self.webpackChunk=self.webpackChunk||[]).push([["default-src_main_web_data_iiif_ImageAPI_ts-src_main_web_data_iiif_ImageAnnotationService_ts"],{"./src/main/web/data/iiif/ImageAPI.ts":(e,t,r)=>{r.d(t,{B7:()=>constructImageUri,OJ:()=>getIIIFServerUrl,Tp:()=>Region,UB:()=>constructServiceRequestUri,jZ:()=>queryImageBounds,n7:()=>constructInformationRequestUri,or:()=>Size});var i,n=r("./node_modules/kefir/dist/kefir.js"),a=r("./node_modules/superagent/lib/client.js"),s=r("./node_modules/urijs/src/URI.js");class Region{}!function(e){class Full extends e{toString(){return"full"}}e.Full=Full;class Rectangular extends e{constructor(e,t,r,i){super(),this.x=e,this.y=t,this.width=r,this.height=i}toString(){return`${this.x},${this.y},${this.width},${this.height}`}}e.Absolute=class Absolute extends Rectangular{};e.Percent=class Percent extends Rectangular{toString(){return"pct:"+super.toString()}},e.full=new Full}(Region||(Region={}));class Size{}!function(e){class Full extends e{toString(){return"full"}}e.Full=Full;class Rectangular extends e{constructor(e,t){super(),this.width=e,this.height=t}toString(){return`${this.width?this.width:""},${this.height?this.height:""}`}}e.Absolute=class Absolute extends Rectangular{};e.BestFit=class BestFit extends Rectangular{toString(){return"!"+super.toString()}};e.Percent=class Percent extends e{constructor(e){super(),this.scale=e}toString(){return`pct:${this.scale}`}},e.full=new Full}(Size||(Size={}));class Rotation{}function constructImageUri(e,t){const r=t.region||Region.full,n=t.size||Size.full,a=t.rotation||Rotation.zero,s=i[t.quality||i.Default].toLowerCase(),o=t.format;let l=`${e}/${t.imageId}/${r}/${n}/${a}/${s}`;return"auto"!==t.format&&(l=l+"."+o),l}function constructInformationRequestUri(e,t){return constructServiceRequestUri(e,t)+"/info.json"}function constructServiceRequestUri(e,t){return e+"/"+encodeURIComponent(t)}function queryImageBounds(e,t){const r=constructInformationRequestUri(e,t);return n.fromNodeCallback((e=>{a.get(r).accept("application/ld+json").end(((t,r)=>{if(t)e(t);else{const i=JSON.parse(r.text);e(t,i)}}))})).toProperty()}function getIIIFServerUrl(e){return s(e).absoluteTo(window.location.href).toString()}!function(e){class Degrees extends e{constructor(e){super(),this.angle=e}toString(){return`${this.angle}`}}class Clockwise extends Degrees{}e.Clockwise=Clockwise;e.MirrorThenClockwise=class MirrorThenClockwise extends Degrees{toString(){return"!"+super.toString()}},e.zero=new Clockwise(0)}(Rotation||(Rotation={})),function(e){e[e.Color=0]="Color",e[e.Gray=1]="Gray",e[e.Bitonal=2]="Bitonal",e[e.Default=3]="Default"}(i||(i={}))},"./src/main/web/data/iiif/ImageAnnotationService.ts":(e,t,r)=>{r.d(t,{K:()=>queryIIIFImageOrRegion,k:()=>parseImageSubarea});var i=r("./node_modules/lodash/lodash.js"),n=r("./node_modules/kefir/dist/kefir.js"),a=r("./node_modules/data.maybe/lib/index.js"),s=r("./src/main/web/api/sparql/index.ts"),o=r("./src/main/web/api/rdf/index.ts"),l=r("./src/main/web/api/async/index.ts");const u=s.ic.Sparql`
  prefix rs: <http://www.researchspace.org/ontology/>
  prefix crmdig: <http://www.cidoc-crm.org/extensions/crmdig/>

  select ?type ?imageID ?area ?bbox ?viewport ?svg ?imageIRI ?carrierImageIRI{
    OPTIONAL {
      ?__iri__ a rs:EX_Digital_Image .
      BIND("image" AS ?type)
      BIND(?__iri__ as ?imageIRI)
      OPTIONAL {
        ?__iri__ crmdig:L60i_is_documented_by/crmdig:L11_had_output ?carrierImageIRI.
      }
    }
    
    OPTIONAL {
      ?__iri__ a rs:EX_Digital_Image_Region;
            rdf:value ?svg.
      ?__iri__ crmdig:L49_is_primary_area_of ?imageIRI .
      BIND("region" AS ?type)
      OPTIONAL { ?__iri__ rs:boundingBox ?bbox }
      OPTIONAL { ?__iri__ rs:viewport ?viewport }
    }
    FILTER(?__imageIdPattern__)
  }
`,c=s.ic.Sparql`
select ?type ?imageID ?area ?bbox ?viewport ?svg ?imageIRI {
  BIND(?__iri__ as ?image) .
  BIND("region" AS ?type)
  FILTER(?__imageIdPattern__)
}
`;function queryIIIFImageOrRegion(e,t,r,g){return function searchRepositoriesForImage(e,t,r,a){return n.combine(r.map((r=>function getImageBindings(e,t,r,i){let a,g;a=i?s.Jx.prepareParsedQuery([{bbox:o.pL.literal(i.bbox),viewport:o.pL.literal(i.viewport),svg:o.pL.literal(i.svg)}])((0,s.Sv)(c)):(0,s.Sv)(u);try{g=s.ic.parsePatterns(t,a.prefixes)}catch(e){return n.constantError(new l.fJ(`Failed to parse image ID patterns '${t}':`,e))}new s.H9("__imageIdPattern__",g).sparqlQuery(a);const I=s.Jx.setBindings(a,{__iri__:e});return s.Jx.select(I,{context:{repository:r}})}(e,t,r,a)))).flatMap((t=>{const r=i.filter(t,(e=>!s.ic.isSelectResultEmpty(e)));return i.isEmpty(r)?n.constantError(`Image or region ${e} not found.`):r.length>1?n.constantError(`Multiple images and/or regions ${e} found.`):n.constant(r[0].results.bindings)}))}(e,t,r,g).flatMap((r=>{const i=r[0],{type:s,imageIRI:o,imageID:l,carrierImageIRI:u}=i;if(!s||!o.isIri())return n.constantError(`Image or region ${e} not found.`);if(!l||l.value.indexOf("/")>=0)return n.constantError(`Invalid image ID '${l.value}' generated from ${o} using pattern: ${t}`);if("image"===s.value)return n.constant({iri:e,imageId:l.value,isRegion:!1,imageIRI:o,carrierImageIRI:u.value});if("region"===s.value){const t=a.fromNullable(i.viewport).chain((e=>parseImageSubarea(e.value))),r=a.fromNullable(i.bbox).chain((e=>parseImageSubarea(e.value))),s=a.fromNullable(i.svg).map((e=>({__html:e.value})));return n.constant({iri:e,imageId:l.value,isRegion:!0,viewport:t.getOrElse(void 0),boundingBox:r.getOrElse(void 0),svgContent:s.getOrElse(void 0),imageIRI:o})}})).toProperty()}function parseImageSubarea(e){if(!e)return a.Nothing();const t=/^xywh=([^,]+),([^,]+),([^,]+),([^,]+)$/.exec(e);return t?a.Just({x:parseFloat(t[1]),y:parseFloat(t[2]),width:parseFloat(t[3]),height:parseFloat(t[4])}):a.Nothing()}}}]);
//# sourceMappingURL=default-src_main_web_data_iiif_ImageAPI_ts-src_main_web_data_iiif_ImageAnnotationService_ts-8458d83b81787323.js.map