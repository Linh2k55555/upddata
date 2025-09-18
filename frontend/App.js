
const { useState } = React;

function App() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setImage(e.target.files[0]);
    setResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return alert("Chưa chọn ảnh!");

    const formData = new FormData();
    formData.append("image", image);

    setLoading(true);
    try {
      const res = await fetch("/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setResult(data.link);
    } catch (err) {
      alert("Lỗi: " + err.message);
    }
    setLoading(false);
  };

  return (
    React.createElement("div", { style: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Segoe UI, sans-serif"
    } },
      React.createElement("div", { style: {
        background: "#fff",
        padding: "32px 24px",
        borderRadius: "16px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        minWidth: "340px"
      } },
        React.createElement("h2", { style: {textAlign: "center", color: "#2b5876", marginBottom: 24} }, "Lưu trữ dữ liệu UPD"),
        React.createElement("form", { onSubmit: handleSubmit, style: {display: "flex", flexDirection: "column", gap: 16} },
          React.createElement("input", {
            type: "file",
            accept: "image/*",
            onChange: handleChange,
            style: {
              padding: "8px",
              borderRadius: "8px",
              border: "1px solid #b2bec3"
            }
          }),
          React.createElement("button", {
            type: "submit",
            disabled: loading,
            style: {
              background: "linear-gradient(90deg, #36d1c4 0%, #5b86e5 100%)",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "10px",
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: "16px"
            }
          }, loading ? "Đang tải..." : "Upload")
        ),
        result && React.createElement("div", { style: {marginTop: 24, textAlign: "center"} },
          React.createElement("p", null, "Link ảnh: ",
            React.createElement("a", { href: result, target: "_blank", rel: "noopener noreferrer" }, result)
          ),
          React.createElement("img", { src: result, alt: "Uploaded", style: {maxWidth: "200px", borderRadius: "8px", marginTop: 8} })
        )
      )
    )
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(React.createElement(App));