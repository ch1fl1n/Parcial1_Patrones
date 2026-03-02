/**
 * Ollama Cloud Configuration for DIR-Soacha
 * Configures connection to Ollama's cloud models for AI-powered climate resilience analysis
 */

/* eslint-disable no-undef */
import {Ollama} from "ollama";

/**
 * Initialize Ollama client with cloud configuration
 * @returns {Ollama} Configured Ollama instance
 */
export function createOllamaClient() {
  // Check if API key is configured
  const apiKey = process.env.OLLAMA_API_KEY;

    if (!apiKey || 'your_api_key_here' === apiKey) {
    console.warn('⚠️  Ollama API key not configured. Please set OLLAMA_API_KEY in .env');
    console.warn('📝 Get your API key from: https://ollama.com/settings/keys');
  }

  const config = {
    host: process.env.OLLAMA_HOST || "https://ollama.com",
  };

  // Add authentication header if API key is available
    if (apiKey && 'your_api_key_here' !== apiKey) {
    config.headers = {
      Authorization: `Bearer ${apiKey}`,
    };
  }

  return new Ollama(config);
}

/**
 * Default model configuration for DIR-Soacha
 */
export const OLLAMA_CONFIG = {
  // Cloud model for large-scale analysis
  cloudModel: process.env.NEXT_PUBLIC_OLLAMA_MODEL || "gpt-oss:120b-cloud",
  
  // Fallback local model (if available)
  localModel: "glm-4.6:cloud",
  
  // Temperature settings for different use cases
  temperature: {
    analysis: 0.3,      // Low temperature for factual analysis
    recommendations: 0.5, // Medium temperature for balanced recommendations
    creative: 0.7,      // Higher temperature for scenario planning
  },
  
  // Maximum tokens for responses
  maxTokens: 2000,
};

/**
 * Check if Ollama is properly configured
 * @returns {boolean} True if configured
 */
export function isOllamaConfigured() {
  const apiKey = process.env.OLLAMA_API_KEY;
    return apiKey && 'your_api_key_here' !== apiKey;
}
