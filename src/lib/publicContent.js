const scholarshipTerms = /\b(?:scholarships?|bursar(?:y|ies))\b/i

export function isScholarshipContent(item) {
  return ['title', 'category', 'excerpt', 'body', 'content', 'description', 'type']
    .some(field => scholarshipTerms.test(String(item?.[field] || '')))
}
