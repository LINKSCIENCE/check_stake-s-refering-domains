"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center text-blue-800">
        Link Checker App
      </h1>
      
      <div className="bg-white p-8 rounded-lg shadow-md max-w-3xl mx-auto">
        <p className="mb-6 text-gray-600">
          Check if a domain or page is already in your referring domains. Enter the URL below to verify.
        </p>
        
        <div className="flex justify-center mb-6">
          <Link 
            href="/check-link" 
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Start Checking Links
          </Link>
        </div>
        
        <div className="border-t pt-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">How it works</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>Enter the URL or domain you want to check</li>
            <li>Our app connects to DataForSEO API to verify referring domains</li>
            <li>Get instant results showing if the link exists in your backlink profile</li>
            <li>Integrate with your link building workflow</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
