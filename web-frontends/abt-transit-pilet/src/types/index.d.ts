
declare module '*.svg?inline' {
    const content: any
    export default content
}

declare module '*.svg' {
    const content: any
    export default content
}
  
import * as DeckTypings from "@danmarshall/deckgl-typings"
declare module "deck.gl" {
    export namespace DeckTypings {}
}