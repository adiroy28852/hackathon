export class Urls {
    static Home() {
      return "/";
    }
    static Login() {
      return "/login";
    }
    static Signup() {
      return "/signup";
    }
  
    static Mcqs = class {
      static Mcqs() {
        return "/mcqs";
      }
      static Mcq(id) {
        return `/mcq/${id}`;
      }
      static NewMcq() {
        return "/mcq/new";
      }
      static EditMcq(id) {
        return `/mcq/${id}/edit`;
      }
    };
  }
  