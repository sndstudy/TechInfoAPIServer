export interface IHackerNewsResponse {
  hits: Array<
    {
      title: string;
      url: string;
      author: string;
      points: number;
      story_text: string,
      comment_text: string,
      _tags: string[],
      num_comments: number,
      objectID: string,
      _highlightResult: {
        title: {
          value: string;
          matchLevel: string;
          matchedWords: string[];
        };
        url: {
          value: string;
          matchLevel: string;
          matchedWords: string[];
        };
        author: {
          value: string;
          matchLevel: string;
          matchedWords: string[];
        };
      };
    }>,
  page: number;
  nbHits: number;
  nbPages: number;
  hitsPerPage: number;
  processingTimeMS: number;
  query: string;
  params: string;
};