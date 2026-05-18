<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class IsbnSearchService
{
    public function search(string $isbn): ?array
    {
        $result = $this->searchOpenBd($isbn) ?? $this->searchGoogleBooks($isbn);

        if ($result !== null && $result['thumbnail_url'] === null) {
            $result['thumbnail_url'] = $this->fetchGoogleBooksThumbnail($isbn, $result['title'] ?? null);
        }

        return $result;
    }

    private function searchOpenBd(string $isbn): ?array
    {
        $response = Http::get('https://api.openbd.jp/v1/get', ['isbn' => $isbn]);

        if (!$response->successful()) {
            return null;
        }

        $data = $response->json();

        if (empty($data[0])) {
            return null;
        }

        $summary = $data[0]['summary'] ?? [];

        if (empty($summary['title'])) {
            return null;
        }

        return [
            'title'         => $summary['title'],
            'author'        => $summary['author'] !== '' ? trim(preg_replace('/\s+\d{4}-\d*/u', '', str_replace(',', ' ', $summary['author']))) : null,
            'thumbnail_url' => $summary['cover'] !== '' ? ($summary['cover'] ?? null) : null,
            'description'   => null,
        ];
    }

    private function googleBooksParams(array $extra = []): array
    {
        $params = array_merge(['q' => ''], $extra);
        $key = config('services.google_books.key');
        if ($key) {
            $params['key'] = $key;
        }
        return $params;
    }

    private function fetchGoogleBooksThumbnail(string $isbn, ?string $title = null): ?string
    {
        $response = Http::get('https://www.googleapis.com/books/v1/volumes',
            $this->googleBooksParams(['q' => "isbn:{$isbn}"])
        );

        if ($response->successful()) {
            $thumbnail = $response->json('items.0.volumeInfo.imageLinks.thumbnail');
            if ($thumbnail) {
                return str_replace('http://', 'https://', $thumbnail);
            }
        }

        if ($title) {
            $response = Http::get('https://www.googleapis.com/books/v1/volumes',
                $this->googleBooksParams(['q' => "intitle:{$title}", 'maxResults' => 5])
            );

            if ($response->successful()) {
                foreach ($response->json('items') ?? [] as $item) {
                    $thumbnail = $item['volumeInfo']['imageLinks']['thumbnail'] ?? null;
                    if ($thumbnail) {
                        return str_replace('http://', 'https://', $thumbnail);
                    }
                }
            }
        }

        return null;
    }

    private function searchGoogleBooks(string $isbn): ?array
    {
        $response = Http::get('https://www.googleapis.com/books/v1/volumes',
            $this->googleBooksParams(['q' => "isbn:{$isbn}"])
        );

        if (!$response->successful()) {
            return null;
        }

        $items = $response->json('items');

        if (empty($items[0]['volumeInfo'])) {
            return null;
        }

        $info = $items[0]['volumeInfo'];

        if (empty($info['title'])) {
            return null;
        }

        $authors = $info['authors'] ?? [];

        return [
            'title'         => $info['title'],
            'author'        => !empty($authors) ? implode(' ', $authors) : null,
            'thumbnail_url' => isset($info['imageLinks']['thumbnail']) ? str_replace('http://', 'https://', $info['imageLinks']['thumbnail']) : null,
            'description'   => $info['description'] ?? null,
        ];
    }
}
