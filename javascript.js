const supabaseUrl = 'https://cncggtziqkzlvrhgitvn.supabase.co'; // <-- replace this
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNuY2dndHppcWt6bHZyaGdpdHZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxMTAwNzgsImV4cCI6MjA2NTY4NjA3OH0.85lwPtoNKzgf00fE0QH1yD_Tonqb_sHGveT7LVdojvo';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);
const form = document.getElementById('open-call-form');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const postal_address = document.getElementById('postal_address').value;

  const art_name = document.getElementById('art_name').value;
  const year_created = document.getElementById('year_created').value;
  const medium = document.getElementById('medium').value;
  const dimensions = document.getElementById('dimensions').value;

  const description = document.getElementById('description').value;
  const artist_bio = document.getElementById('artist_bio').value;

  const fileInput = document.getElementById('attachment');
  const file = fileInput.files[0];
  let file_url = '';

  if (file) {
    const fileName = `${Date.now()}_${file.name}`;

    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('artworks') 
      .upload(fileName, file);

    if (uploadError) {
      alert('File upload failed.');
      console.error(uploadError);
      return;
    }

    file_url = `${supabaseUrl}/storage/v1/object/public/artworks/${fileName}`;
  }

  const { data, error } = await supabase.from('art_submissions').insert([{
    name,
    email,
    postal_address,
    art_name,
    year_created: parseInt(year_created),
    medium,
    dimensions,
    description,
    artist_bio,
    file_url
  }]);

  if (error) {
    alert('Submission failed.');
    console.error(error);
  } else {
    alert('Submitted successfully!');
    form.reset();
  }
});