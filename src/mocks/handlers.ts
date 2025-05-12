// src/mocks/handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/v1/search', async ({ request }) => {
    const url = new URL(request.url);
    const query = url.searchParams.get('q'); // Changed from 'query' to 'q'
    // const type = url.searchParams.get('type');
    // const lang = url.searchParams.get('lang');
    // const limit = url.searchParams.get('limit');
    // const offset = url.searchParams.get('offset');

    if (query === 'error') {
      return new HttpResponse(null, { status: 500, statusText: 'Simulated Server Error' });
    }

    if (query === 'empty') {
      return HttpResponse.json({ results: [] }); // Ensure response is an object with a results array
    }

    // Default mock search results
    const mockResults = {
      results: [ // Ensure results are in a 'results' array
        { qid: 'Q64', label: `Berlin for "${query}"`, description: 'Capital of Germany', thumbnail_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Brandenburger_Tor_abends.jpg/100px-Brandenburger_Tor_abends.jpg' },
        { qid: 'Q90', label: `Paris for "${query}"`, description: 'Capital of France', thumbnail_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/La_Tour_Eiffel_vue_de_la_Tour_Saint-Jacques%2C_Paris_ao%C3%BBt_2014.jpg/100px-La_Tour_Eiffel_vue_de_la_Tour_Saint-Jacques%2C_Paris_ao%C3%BBt_2014.jpg' },
      ]
    };
    return HttpResponse.json(mockResults);
  }),

  http.get('/api/v1/suggest', async ({ request }) => {
    const url = new URL(request.url);
    const prefix = url.searchParams.get('prefix');
    // const lang = url.searchParams.get('lang');
    // const limit = url.searchParams.get('limit');

    if (prefix === 'error') {
      return new HttpResponse(null, { status: 500, statusText: 'Simulated Suggestion Error' });
    }

    if (prefix === 'empty' || !prefix) {
      return HttpResponse.json({ suggestions: [] });
    }
    
    const mockSuggestions = {
      suggestions: [
        { qid: 'Q64', label: `Berlin suggestion for "${prefix}"`, description: 'Capital of Germany' },
        { qid: 'Q90', label: `Paris suggestion for "${prefix}"`, description: 'Capital of France' },
        { qid: 'Q1726', label: `Munich suggestion for "${prefix}"`, description: 'Capital of Bavaria, Germany' },
      ]
    };
    return HttpResponse.json(mockSuggestions);
  }),

  http.get('/api/v1/item/:qid', async ({ params, request }) => {
    const { qid } = params;
    const url = new URL(request.url);
    const lang = url.searchParams.get('lang') || 'en';


    if (qid === 'item-error') {
      return new HttpResponse(null, { status: 500, statusText: 'Simulated Item Fetch Error' });
    }
    if (qid === 'Q64') { // Berlin
      return HttpResponse.json({
        qid: 'Q64',
        label: 'Berlin',
        description: 'Capital and largest city of Germany',
        aliases: ['Berlino', 'Spree-Athen'],
        language_info: {
          label_lang: lang,
          description_lang: lang,
        },
        image_info: {
          url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Brandenburger_Tor_abends.jpg/800px-Brandenburger_Tor_abends.jpg',
          alt_text_default: 'Brandenburg Gate at night',
        },
        wikidata_url: 'https://www.wikidata.org/wiki/Q64',
        key_facts: [
          { property_pid: 'P31', property_label: 'instance of', value_qid: 'Q5119', value_label: 'capital city', value_is_item: true },
          { property_pid: 'P17', property_label: 'country', value_qid: 'Q183', value_label: 'Germany', value_is_item: true },
          { property_pid: 'P625', property_label: 'coordinate location', value_string: '52°31′N 13°24′E', value_is_item: false },
        ],
        statements: {
          'P36': [ // capital of
            { property_pid: 'P36', property_label: 'capital of', value_qid: 'Q183', value_label: 'Germany', value_is_item: true, qualifiers: [] }
          ],
          'P1082': [ // population
            { property_pid: 'P1082', property_label: 'population', value_string: '3,677,472 (as of 2021)', value_is_item: false, qualifiers: [] }
          ],
        }
      });
    }
    if (qid === 'Q90') { // Paris
      return HttpResponse.json({
        qid: 'Q90',
        label: 'Paris',
        description: 'Capital and most populous city of France',
        aliases: ['Paname', 'Lutèce', 'City of Light'],
        language_info: {
          label_lang: lang,
          description_lang: lang,
        },
        image_info: {
          url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/La_Tour_Eiffel_vue_de_la_Tour_Saint-Jacques%2C_Paris_ao%C3%BBt_2014.jpg/800px-La_Tour_Eiffel_vue_de_la_Tour_Saint-Jacques%2C_Paris_ao%C3%BBt_2014.jpg',
          alt_text_default: 'Eiffel Tower viewed from Saint-Jacques Tower',
        },
        wikidata_url: 'https://www.wikidata.org/wiki/Q90',
        key_facts: [
          { property_pid: 'P31', property_label: 'instance of', value_qid: 'Q5119', value_label: 'capital city', value_is_item: true },
          { property_pid: 'P17', property_label: 'country', value_qid: 'Q142', value_label: 'France', value_is_item: true },
        ],
        statements: {
          'P36': [ // capital of
            { property_pid: 'P36', property_label: 'capital of', value_qid: 'Q142', value_label: 'France', value_is_item: true, qualifiers: [] }
          ],
          'P2044': [ // elevation above sea level
            { property_pid: 'P2044', property_label: 'elevation above sea level', value_string: '35 m', value_is_item: false, qualifiers: [] }
          ]
        }
      });
    }
    // Default item for any other QID
    return HttpResponse.json({
      qid: qid as string,
      label: `Label for Item ${qid} (${lang})`,
      description: `This is a detailed description for item ${qid} in ${lang}.`,
      aliases: [`Alias1-${qid}`, `Alias2-${qid}`],
      language_info: {
        label_lang: lang,
        description_lang: lang,
      },
      image_info: {
        url: 'https://via.placeholder.com/150',
        alt_text_default: `Placeholder image for ${qid}`,
      },
      wikidata_url: `https://www.wikidata.org/wiki/${qid}`,
      key_facts: [
        { property_pid: 'P31', property_label: 'instance of', value_qid: 'Q4167410', value_label: 'disambiguation page', value_is_item: true },
      ],
      statements: {
        'P18': [ // image
          { property_pid: 'P18', property_label: 'image', value_string: 'generic_image.jpg', value_is_item: false, qualifiers: [] }
        ]
      }
    });
  }),
];