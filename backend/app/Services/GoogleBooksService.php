<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class GoogleBooksService
{
    private string $baseUrl = 'https://www.googleapis.com/books/v1/volumes';

    public function search(string $query, int $maxResults = 20): array
    {
        $params = ['q' => $query, 'maxResults' => $maxResults];

        $apiKey = config('services.google_books.key', '');
        if ($apiKey) {
            $params['key'] = $apiKey;
        }

        $response = Http::get($this->baseUrl, $params);

        if (!$response->successful()) {
            return [];
        }

        return array_map(
            fn($item) => $this->formatBook($item),
            $response->json('items', [])
        );
    }

    private function formatBook(array $item): array
    {
        $info = $item['volumeInfo'] ?? [];
        $authors = $info['authors'] ?? [];
        $isbns = $info['industryIdentifiers'] ?? [];

        $isbn = collect($isbns)->firstWhere('type', 'ISBN_13')['identifier']
            ?? collect($isbns)->firstWhere('type', 'ISBN_10')['identifier']
            ?? null;

        $thumbnail = $info['imageLinks']['thumbnail']
            ?? $info['imageLinks']['smallThumbnail']
            ?? null;

        return [
            'google_books_id' => $item['id'],
            'title'           => $info['title'] ?? '不明なタイトル',
            'author'          => !empty($authors) ? implode(' ', $authors) : null,
            'isbn'            => $isbn,
            'thumbnail_url'   => $thumbnail,
            'description'     => $info['description'] ?? null,
        ];
    }
}
